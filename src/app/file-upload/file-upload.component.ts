import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {catchError, finalize} from 'rxjs/operators';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {noop, of} from 'rxjs';


@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers:
  [
    {
      provide:NG_VALUE_ACCESSOR,
      multi:true,
      useExisting:FileUploadComponent
    },
    {
      provide:NG_VALIDATORS,
      multi:true,
      useExisting:FileUploadComponent
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor,Validator {
  @Input()
  requiredFileType:string;
  fileName = '';
  fileUploadError = false;
  fileUploadSuccess = false;

  uploadProgress:number;
  disabled:boolean = false;
  onChange =(fileName:string)=>{};
  onTouched=()=>{};
  onValidatorChange: () => void;

  constructor(private http:HttpClient){
  }
  
  registerOnValidatorChange(onValidatorChange: ()=>void):void {
     this.onValidatorChange = onValidatorChange;
  }
  onFileSelected($event: any) {
    const file:File = $event.target.files[0];
    if(file) {
      this.fileName = file.name;
      console.log(this.fileName);
      const formData = new FormData();
      formData.append("thumbnail",file);
      this.fileUploadError = false;
      this.http.post("/api/thumbnail-upload",formData,{
        reportProgress:true,
        observe:'events'
      })
      .pipe(catchError(error=>{
        this.fileUploadError=true;
        return of(error);
      }),
      finalize(()=>
      {
        this.uploadProgress = null;
      })
      )
      .subscribe(event=>{
        if(event.type == HttpEventType.UploadProgress)
        {
           this.uploadProgress = Math.round(100 * (event.loaded/event.total));
        }
        else if(event.type==HttpEventType.Response) {
            this.fileUploadSuccess = true;
            this.onChange(this.fileName);
            this.onValidatorChange();
        }
      });
    }
  }
  writeValue(value: any): void {
    this.fileName = value;
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }
  onClick(fileUpload: HTMLInputElement) {
    this.onTouched();
    fileUpload.click();
  }
  
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
      if(this.fileUploadSuccess){
        return null;
      }
      let errors : any = {
         requiredFileType:this.requiredFileType
      }
      if(this.fileUploadError){
         errors.uploadFailed = true;
      }
      return errors;
  }
}

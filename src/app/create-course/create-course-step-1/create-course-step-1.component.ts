import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoursesService} from '../../services/courses.service';
import { courseTitleValidator } from '../../validators/course-title.validator';
import { Observable } from 'rxjs';

interface CourseCategory {
  code:string;
  description:string;
}

@Component({
  selector: 'create-course-step-1',
  templateUrl: './create-course-step-1.component.html',
  styleUrls: ['./create-course-step-1.component.scss']
})
export class CreateCourseStep1Component implements OnInit {

   form=this.fb.group({
      title:['',{
      validators:
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(60)
      ],
      asyncValidators:[courseTitleValidator(this.courses)],
      updateOn:'blur'
    }],
    releasedAt:[new Date(),Validators.required],
    category:['BEGINNER',Validators.required],
    downloadsAllowed:[false,Validators.requiredTrue],
    longDescription:['',[Validators.required,Validators.minLength(3)]]
  });
  courseCategories$:Observable<CourseCategory[]>;
  constructor(private fb:FormBuilder,private courses:CoursesService){

  }
  ngOnInit() {
      this.courseCategories$=this.courses.findCourseCategories();
  }
  get courseTitle(){
    return this.form.controls['title'];
  }
}

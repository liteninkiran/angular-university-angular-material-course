import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../model/course';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
})
export class CoursesCardListComponent implements OnInit {

    @Input() public courses: Course[];

    constructor() {
    }

    public ngOnInit(): void {

    }

    public editCourse(course: Course): void {

    }
}

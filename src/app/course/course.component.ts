import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { Lesson } from '../model/lesson';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, AfterViewInit {

    public displayedColumns = ['seqNo', 'description', 'duration'];
    public course: Course;
    public lessons: Lesson[];
    public loading = false;

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private coursesService: CoursesService
    ) {

    }

    public ngOnInit(): void {
        this.course = this.route.snapshot.data['course'];
        this.loadLessonsPage();
    }

    public ngAfterViewInit(): void {
        this.paginator.page.pipe(
            tap(() => this.loadLessonsPage()),
        ).subscribe();
    }

    public loadLessonsPage(): void {
        this.loading = true;

        const sortOrder = 'asc';
        const pageNumber = this.paginator?.pageIndex ?? 0;
        const pageSize = this.paginator?.pageSize ?? 3;
        const sortColumn = 'seqNo';

        this.coursesService.findLessons(this.course.id, sortOrder, pageNumber, pageSize, sortColumn)
            .pipe(
                tap(lessons => this.lessons = lessons),
                catchError(err => {
                    console.log('Error loading lessons', err);
                    alert('Error loading lessons.');
                    return throwError(err);
                }),
                finalize(() => this.loading = false)
            )
            .subscribe();
    }
}

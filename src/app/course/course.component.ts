import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { Lesson } from '../model/lesson';
import { catchError, finalize, tap } from 'rxjs/operators';
import { merge, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, AfterViewInit {

    public displayedColumns = ['select', 'seqNo', 'description', 'duration'];
    public course: Course;
    public lessons: Lesson[];
    public loading = false;
    public expandedLesson: Lesson = null;
    public selection = new SelectionModel<Lesson>(true, []);

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    @ViewChild(MatSort)
    public sort: MatSort;

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
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(tap(() => this.loadLessonsPage()))
            .subscribe();
    }

    public loadLessonsPage(): void {
        this.loading = true;

        const pageNumber = this.paginator?.pageIndex ?? 0;
        const pageSize = this.paginator?.pageSize ?? 10;
        const sortOrder = this.sort?.direction ?? 'asc';
        const sortColumn = this.sort?.active ?? 'seqNo';

        this.coursesService.findLessons(
            this.course.id,
            pageNumber,
            pageSize,
            sortOrder,
            sortColumn,
        )
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

    public onToggleLesson(lesson: Lesson): void {
        if (lesson === this.expandedLesson) {
            this.expandedLesson = null;
        }
        else {
            this.expandedLesson = lesson;
        }
    }

    public onLessonToggled(lesson: Lesson): void {
        this.selection.toggle(lesson);
        console.log(this.selection.selected);
    }

    public isAllSelected(): boolean {
        return this.selection.selected?.length == this.lessons?.length;
    }

    public toggleAll(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.selection.select(...this.lessons);
    }
}

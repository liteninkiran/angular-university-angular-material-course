import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map } from 'rxjs/operators';
import { Lesson } from '../model/lesson';

@Injectable()
export class CoursesService {

    constructor(private http: HttpClient) {

    }

    public findCourseById(courseId: number): Observable<Course> {
        return this.http.get<Course>(`/api/courses/${courseId}`);
    }

    public findAllCourses(): Observable<Course[]> {
        return this.http.get('/api/courses')
            .pipe(
                map(res => res['payload'])
            );
    }

    public findAllCourseLessons(courseId: number): Observable<Lesson[]> {
        return this.http.get('/api/lessons', {
            params: new HttpParams()
                .set('courseId', courseId.toString())
                .set('pageNumber', '0')
                .set('pageSize', '1000')
        }).pipe(
            map(res => res['payload'])
        );
    }

    public findLessons(
        courseId: number,
        pageNumber = 0,
        pageSize = 3,
        sortOrder = 'asc',
        sortColumn = 'seqNo'
    ): Observable<Lesson[]> {
        return this.http.get('/api/lessons', {
            params: new HttpParams()
                .set('courseId', courseId.toString())
                .set('sortOrder', sortOrder)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
                .set('sortColumn', sortColumn)
        }).pipe(
            map(res => res['payload'])
        );
    }
}

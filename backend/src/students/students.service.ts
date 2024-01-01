import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/typeorm/entities/student.entity';
import { User } from 'src/typeorm/entities/user.entity';
import {
  CreateStudentInfoParams,
  UpdateStudentInfoParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async createStudentInfo(
    userId: number,
    createStudentInfo: CreateStudentInfoParams,
  ) {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const newStudentInfo = this.studentRepository.create({
      ...createStudentInfo,
      user: user,
    });

    return this.studentRepository.save(newStudentInfo);
  }

  async updateStudentInfo(
    studentId: number,
    updateStudentInfo: UpdateStudentInfoParams,
  ) {
    const user = await this.studentRepository.findOneBy({ studentId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    await this.studentRepository.update(
      { studentId },
      { ...updateStudentInfo },
    );
  }
}

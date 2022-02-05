import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResponseElement } from './dto/file-response-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {
	}
	
	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileResponseElement[]> {
		const saveArray: MFile[] = [new  MFile(file)];

		if (file.mimetype.includes('image')) {
			const buffer = await this.filesService.convertToWebP(file.buffer);
			saveArray.push(new MFile({ originalname: `${file.originalname.split('.')[0]}.webp`, buffer}))
		}

		return this.filesService.saveFile(saveArray)
	}
}

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post, UseGuards,
	UsePipes, ValidationPipe
} from '@nestjs/common';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {
	}

	@UseGuards(JwtGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}
	
	@UseGuards(JwtGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
	 	const topPage = await this.topPageService.findById(id);

		if (!topPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		}

		return topPage;
	}
	
	
	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const topPage = await this.topPageService.getByAlias(alias);
		
		if (!topPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		}
		
		return topPage;
	}
	
	@UseGuards(JwtGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.deleteById(id);
		
		if (!topPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		}
		
		return topPage;
	}
	
	@UseGuards(JwtGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const topPage = await this.topPageService.updateById(id, dto);
		
		if (!topPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
		}
		
		return topPage;
	}
	
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find ')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}
	
	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}

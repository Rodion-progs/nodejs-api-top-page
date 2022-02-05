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
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { HhService } from '../hh/hh.service';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly topPageService: TopPageService,
		private readonly hhService: HhService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {
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
	
	@Cron('0 0 * * *', { name: 'test' })
	async test() {
		const job = this.schedulerRegistry.getCronJob('test');
		const data = await this.topPageService.findForHhUpdate(new Date());
		for (let page of data) {
			const hhData = await this.hhService.getData(page.category);
			page.hh = hhData;
			await this.sleep();
			await this.topPageService.updateById(page._id, page);
		}
	}
	
	sleep() {
		return new Promise<void>((resolve => {
			setTimeout(() => {
				resolve()
			}, 1000)
		}))
	}
}

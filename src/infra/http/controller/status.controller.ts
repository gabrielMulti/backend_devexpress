import { Controller, Get } from '@nestjs/common';
import { format } from 'date-fns';

@Controller('')
export class StatusController {
    @Get('status')
    status(): any {
      return {
        api: 'API Server',
        data: format(new Date(),'dd/MM/yyyy HH:mm:ss'),
        status: 200,
      };
    }
}

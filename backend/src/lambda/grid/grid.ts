import { bindings } from "src/bindings";
import { BadRequestError, InternalServerError } from "src/celestial-service/error";
import { errorOutput, successOutput } from "src/celestial-service/LambdaOutput";
import { LambdaContext, LambdaEvent, LambdaOutput } from "src/celestial-service/model/Lambda";
import { GridService } from "src/service/GridService";

export async function grid(
    event: LambdaEvent,
    _context?: LambdaContext): Promise<LambdaOutput> {
    let service: GridService | null = null
    try {
        service = bindings.get(GridService)

        let res: unknown;

        switch (event.resource) {
            case '/api/grid':
                res = await apiGrid(event, service)
                break;
            default:
                throw new InternalServerError('unknown resource');

        }

        return successOutput(res);
    } catch (e) {
        return errorOutput(e);
    }
}

async function apiGrid(event:LambdaEvent,service:GridService){
     switch(event.httpMethod){
        case 'POST':
          if (event.body === null)
            throw new BadRequestError('body should not be empty');
    
          return service.someFunction();
        default:
          throw new InternalServerError('unknown http method');
     }
}
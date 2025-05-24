export enum ResponseCode {
  SUCCESS = 'T-SUCCESS',
  NOT_FOUND = 'F-NOT_FOUND',
  UNAUTHORIZED = 'F-UNAUTHORIZED',
  TOO_MANY_REQUESTS = 'F-TOO_MANY_REQUESTS',
  SERVER_ISSUE = 'F-SERVER_ISSUE',
}

export type BaseResponse = {
  status: number,
  responseCode: ResponseCode,
}

export type SuccessResponseWithoutData = BaseResponse;

export type SuccessResponseWithData = BaseResponse & {
  data: any,
}

export type FailureResponseWithoutError = BaseResponse;

export type FailureResponseWithError = BaseResponse & {
  error: any,
};

export class Response {
  private data: any;

  constructor() {}

  public static withData(data: any): Response {
    const response = new Response();
    response.setData(data);

    return response;
  }

  public static withoutData(): Response {
    return new Response();
  }


  private setData(data: any) {
    this.data = data;
  }

  public toSuccessResponseWithData(): SuccessResponseWithData {
    return {
      status: 200,
      responseCode: ResponseCode.SUCCESS,
      data: this.data,
    };
  }

  public toNotFoundResponse(): FailureResponseWithoutError {
    return {
      status: 404,
      responseCode: ResponseCode.NOT_FOUND,
    };
  }

  public toUnauthorizedResponse(): FailureResponseWithoutError {
    return {
      status: 403,
      responseCode: ResponseCode.UNAUTHORIZED,
    };
  }

  public toServerIssueResponse(): FailureResponseWithoutError {
    return {
      status: 500,
      responseCode: ResponseCode.SERVER_ISSUE,
    };
  }
}

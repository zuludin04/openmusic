class AuthenticationsHandler {
  constructor(authenticationsService, userService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      message: "Authentication Success",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  // eslint-disable-next-line no-unused-vars
  async putAuthenticationHandler(request, _) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: "success",
      message: "Success Refresh Token",
      data: {
        accessToken,
      },
    };
  }

  // eslint-disable-next-line no-unused-vars
  async deleteAuthenticationHandler(request, _) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Success Delete Refresh Token",
    };
  }
}

module.exports = AuthenticationsHandler;

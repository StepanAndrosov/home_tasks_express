"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const utils_1 = require("../../src/utils");
const app_2 = require("../../src/app");
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete(app_2.RouterPaths.testing);
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_2.RouterPaths.videos)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(app_2.RouterPaths.videos + '/999999')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should`n create entity', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post(app_2.RouterPaths.videos)
            .send({ title: '' })
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get(app_2.RouterPaths.videos)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should create entity with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'new entity';
        const response = yield (0, supertest_1.default)(app_1.app)
            .post(app_2.RouterPaths.videos)
            .send({ title })
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        const createdCource = response.body;
        expect(createdCource).toEqual({
        // id: expect.any(Number),
        // title: title
        });
        yield (0, supertest_1.default)(app_1.app)
            .get(app_2.RouterPaths.videos)
            .expect(utils_1.HTTP_STATUSES.OK_200, [{ id: 1, title }]);
    }));
    it('should delete course', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(app_2.RouterPaths.videos + '/1')
            .expect(utils_1.HTTP_STATUSES.NO_CONTEND_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(app_2.RouterPaths.videos)
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    }));
});

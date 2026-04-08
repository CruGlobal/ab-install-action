const assert = require("assert");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const fakeExec = sinon.fake.resolves("");
const fakeWait = sinon.fake.resolves("");

const stackDeploy = proxyquire("../src/stackDeploy", {
   "@actions/exec": { exec: fakeExec },
   "./util/waitService.js": { waitServiceUp: fakeWait },
});

beforeEach(() => {
   fakeExec.resetHistory();
   fakeWait.resetHistory();
});

describe("stackDeploy", () => {
   it("runs UP.sh then docker stack services", async () => {
      await stackDeploy("AppBuilder", "ab");
      assert.equal(fakeExec.callCount, 2);
      const [upSh, stackServices] = fakeExec.args;
      assert.equal(upSh[0], "./UP.sh");
      assert.deepEqual(upSh[1], ["-t", "-q"]);
      assert.equal(upSh[2].cwd, "./AppBuilder");
      assert.equal(stackServices[0], "docker stack services");
      assert.deepEqual(stackServices[1], ["ab"]);
      assert.equal(fakeWait.callCount, 1);
      assert.equal(fakeWait.firstCall.args[0], "sails");
   });
});

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = __dirname + "/../Protos/healthData.proto";

console.log("Loading proto file from: ", PROTO_PATH);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const healthDataProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new healthDataProto.HealthData(
  "datamanager:5266",
  grpc.credentials.createInsecure()
);

export { client };


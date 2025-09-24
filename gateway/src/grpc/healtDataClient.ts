import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./Proto/healthData.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const healthDataProto = grpc.loadPackageDefinition(packageDefinition) as any;

const client = new healthDataProto.Gateway.Grpc.HealthData(
  "datamanager:5266",
  grpc.credentials.createInsecure()
);

export { client };

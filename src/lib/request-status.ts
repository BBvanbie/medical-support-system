import { RequestStatus } from "@prisma/client";

const TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  PENDING: [
    "ACCEPTABLE",
    "DECLINED",
    "ACCEPTABLE_WITH_CONDITIONS",
    "CONSULT_REQUIRED",
    "CANCELLED",
  ],
  ACCEPTABLE: ["TRANSPORT_DECIDED", "CANCELLED"],
  DECLINED: ["CANCELLED"],
  ACCEPTABLE_WITH_CONDITIONS: ["TRANSPORT_DECIDED", "CANCELLED"],
  CONSULT_REQUIRED: ["PENDING", "CANCELLED"],
  TRANSPORT_DECIDED: [],
  CANCELLED: [],
};

export function canTransition(from: RequestStatus, to: RequestStatus) {
  return TRANSITIONS[from].includes(to);
}

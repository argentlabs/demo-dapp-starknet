import { Abi } from "@starknet-react/core"

const dummyContractAbi = [
  {
    type: "function",
    name: "set_number",
    state_mutability: "external",
    inputs: [
      {
        name: "number",
        type: "core::felt252",
      },
    ],
    outputs: [],
  },
] as const satisfies Abi

export { dummyContractAbi }

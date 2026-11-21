import assert from "node:assert/strict";
import test from "node:test";
import {
  employeeOptions,
  providerOptions,
  validateAccessRequest,
} from "../src/lib/early-access.ts";

const validRequest = {
  name: "Alex Morgan",
  email: "alex@example.com",
  company: "Example Studio",
  employees: "11-50",
  provider: "Google Workspace",
  message: "We are interested in a customer-managed pilot.",
  intent: "access",
};

test("accepts complete early-access details", () => {
  assert.deepEqual(validateAccessRequest(validRequest), {});
});

test("requires all five required fields", () => {
  const errors = validateAccessRequest({
    ...validRequest,
    name: "",
    email: "",
    company: "",
    employees: "",
    provider: "",
  });
  assert.deepEqual(Object.keys(errors).sort(), [
    "company",
    "email",
    "employees",
    "name",
    "provider",
  ]);
});

test("rejects malformed email addresses", () => {
  for (const email of [
    "alex",
    "alex@",
    "@example.com",
    "alex@example",
    "alex m@example.com",
  ]) {
    assert.ok(validateAccessRequest({ ...validRequest, email }).email, email);
  }
});

test("rejects whitespace-only names and companies", () => {
  const errors = validateAccessRequest({
    ...validRequest,
    name: "   ",
    company: "  ",
  });
  assert.ok(errors.name);
  assert.ok(errors.company);
});

test("accepts every supported provider and company size", () => {
  for (const provider of providerOptions) {
    for (const employees of employeeOptions) {
      assert.deepEqual(
        validateAccessRequest({ ...validRequest, provider, employees }),
        {},
      );
    }
  }
});

test("rejects unlisted provider and size values", () => {
  const errors = validateAccessRequest({
    ...validRequest,
    provider: "unlisted",
    employees: "unknown",
  });
  assert.ok(errors.provider);
  assert.ok(errors.employees);
});

test("enforces field length limits", () => {
  const errors = validateAccessRequest({
    ...validRequest,
    name: "A".repeat(101),
    company: "A".repeat(151),
    message: "A".repeat(2001),
    email: `${"a".repeat(250)}@example.com`,
  });
  assert.ok(errors.name);
  assert.ok(errors.company);
  assert.ok(errors.message);
  assert.ok(errors.email);
});

test("allows an empty optional message and boundary-length fields", () => {
  assert.deepEqual(validateAccessRequest({ ...validRequest, message: "" }), {});
  assert.deepEqual(
    validateAccessRequest({
      ...validRequest,
      name: "A".repeat(100),
      company: "A".repeat(150),
      message: "A".repeat(2000),
    }),
    {},
  );
});

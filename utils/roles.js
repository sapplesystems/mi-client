const BRANCH_USER = "branch_user";
const ORG_ADMIN = "org_admin";

const APPLICANT_ROLES = [BRANCH_USER, ORG_ADMIN];

export function is_applicant(role) {
  return APPLICANT_ROLES?.includes(role);
}

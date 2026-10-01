import { api, APIError } from "encore.dev/api";
import { portfolioDB } from "./db";
import { assertAdmin } from "./authz";

export interface DeleteProjectRequest {
  id: number;
}

// Deletes a project.
export const deleteProject = api<DeleteProjectRequest, void>(
  { expose: true, auth: true, method: "DELETE", path: "/projects/:id" },
  async (req) => {
    assertAdmin();

    const existing = await portfolioDB.queryRow`
      SELECT id FROM projects WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("project not found");
    }

    await portfolioDB.exec`
      DELETE FROM projects WHERE id = ${req.id}
    `;
  }
);

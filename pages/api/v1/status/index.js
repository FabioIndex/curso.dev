import database from "infra/database.js";
import { version } from "react";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const maxConnections = await database.query(" SHOW max_connections;");
  const maxConnectionsValue = parseInt(maxConnections.rows[0].max_connections);
  const statusdatabase = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity   WHERE datname ='postgres';",
  );
  console.log(statusdatabase.rows[0]);

  const statusdatabaseValue = parseInt(statusdatabase.rows[0].count);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        maxConnections: maxConnectionsValue,
        portas: statusdatabaseValue,
      },
    },
  });
}

export default status;

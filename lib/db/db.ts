// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";

// const prisma = new PrismaClient().$extends(withAccelerate());
// export default prisma;

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

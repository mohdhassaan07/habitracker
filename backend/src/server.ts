import { server, PORT } from "./app";

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

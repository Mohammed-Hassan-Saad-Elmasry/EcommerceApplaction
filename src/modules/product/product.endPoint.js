import { roles } from "../../middleware/auth.js";

export  const endpoint = {
    create:[roles.Admin],
    productList:[roles.User]
};

export default endpoint;

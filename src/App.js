import Inventory from "./Inventory.js";
import { orderView } from "./View/inputView.js";
import { comeView } from "./View/outputView.js";
import { readFileAndParse } from "./readMD.js";

class App {
  async run() {
    const PRODUCT_PATH = './public/products.md';
    const INVEN = new Inventory(readFileAndParse(PRODUCT_PATH))
    comeView(INVEN.products)
    const INPUT_OBJECTS = await orderView()
    const BILL_ARR = INVEN.buy(INPUT_OBJECTS)

  }
}

export default App;

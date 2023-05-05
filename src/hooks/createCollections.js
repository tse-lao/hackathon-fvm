import { Polybase } from "@polybase/client";

const db = new Polybase({ defaultNamespace: "your-namespace" })


await db.applySchema(`
  @public
  collection Files {
    id: string;
    cid: string;
    country?: string;

    constructor (id: string, name: string) {
      this.id = id;
      this.name = name;
    }

    setCountry (country: string) {
      this.country = country;
    }
  }

  @public
  collection FileShared {
    id: string;
    name: string;

    constructor (id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }
`,
  "connect-data"
); // your-namespace is optional if you have defined a default namespace
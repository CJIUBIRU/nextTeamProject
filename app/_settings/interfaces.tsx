export type Product = {
  id: string; //doc.id
  userId: number;
  userName: string;
  date: string;
  period: string;
  rentTime: string;
  returnTime: string;
  equipmentCategory: string;
  equipmentQuantity: number;
};

export type Period = {
  id: string,  //doc.id
  userId: number, 
  userName: string, 
  category: string,
  quantity: number,
  period: string, 
  rentId: String[],
  rentTime: string,
  returnTime: string,
  date: string,
  visible?: boolean;
};

export type Category = {
id: string,  //doc.id
categoryName: string,
categoryQuantity : number,
rentAble: number,
repairTotal: number
}

export type Equipment = {
id: string;
displayId?: number;
equipmentName: string;
equipmentStatus: number;
};

export type Account = {
  docId: string, //doc.id
  id: number,
  name: string,
  level: number // 0: student level; 1: teacher level
}

export type Repair = {
  id: string, //doc.id
  equipmentId: string[],
  repairReason: string,
  repairStatus: number, // 0: student level; 1: teacher level
  repiarPhoto: string,
  equipmentCategory: string,
  submitTime: string,
  doneTime: string,
}
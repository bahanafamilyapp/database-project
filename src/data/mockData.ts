export interface Person {
  id: string;
  name: string;
  gender: string;
  dob: string;
  education: string;
  city: string;
  marga: string;
}

export interface Household {
  id: string;
  title: string;
  city: string;
  address: string;
  coords: [number, number];
  members: string[];
}

export interface TreeNode {
  id: string;
  name: string;
  personId: string;
  spouse?: { personId: string };
  children?: TreeNode[];
}

export const people: Person[] = [
  { id: "p0", name: "R. Soerjono", gender: "Laki-laki", dob: "1930-01-15", education: "SMA", city: "Jakarta Pusat", marga: "Soerjono" },
  { id: "p1", name: "H. Wijaya", gender: "Laki-laki", dob: "1955-03-20", education: "S1", city: "Jakarta Selatan", marga: "Wijaya" },
  { id: "p2", name: "Hj. Kartini Wijaya", gender: "Perempuan", dob: "1957-08-12", education: "Diploma", city: "Jakarta Selatan", marga: "Tanjung" },
  { id: "p3", name: "Ahmad Wijaya", gender: "Laki-laki", dob: "1985-03-15", education: "S1", city: "Jakarta Selatan", marga: "Wijaya" },
  { id: "p4", name: "Siti Nurhaliza", gender: "Perempuan", dob: "1987-07-22", education: "S1", city: "Jakarta Selatan", marga: "Wijaya" },
  { id: "p5", name: "R. Santoso", gender: "Laki-laki", dob: "1958-09-10", education: "S2", city: "Bandung", marga: "Santoso" },
  { id: "p6", name: "Budi Santoso", gender: "Laki-laki", dob: "1990-11-08", education: "SMA", city: "Bandung", marga: "Santoso" },
  { id: "p7", name: "Dewi Sartika", gender: "Perempuan", dob: "1992-05-14", education: "S2", city: "Bandung", marga: "Santoso" },
  { id: "p8", name: "Rudi Hermawan", gender: "Laki-laki", dob: "1988-09-30", education: "Diploma", city: "Surabaya", marga: "Hermawan" },
  { id: "p9", name: "Linda Hermawan", gender: "Perempuan", dob: "1990-12-05", education: "S1", city: "Surabaya", marga: "Hermawan" },
  { id: "p10", name: "Andi Prasetyo", gender: "Laki-laki", dob: "1995-02-18", education: "S1", city: "Yogyakarta", marga: "Prasetyo" },
  { id: "p11", name: "Maya Sari", gender: "Perempuan", dob: "1996-06-25", education: "S1", city: "Yogyakarta", marga: "Sari" },
  { id: "p12", name: "Fajar Ramadhan", gender: "Laki-laki", dob: "1993-04-10", education: "S2", city: "Semarang", marga: "Ramadhan" },
  { id: "p13", name: "Nina Kusuma", gender: "Perempuan", dob: "1994-08-22", education: "S1", city: "Semarang", marga: "Kusuma" },
  { id: "p14", name: "Agus Setiawan", gender: "Laki-laki", dob: "1986-01-30", education: "Diploma", city: "Malang", marga: "Setiawan" },
  { id: "p15", name: "Rina Setiawan", gender: "Perempuan", dob: "1988-03-12", education: "SMA", city: "Malang", marga: "Setiawan" },
  { id: "p16", name: "Hendra Kusuma", gender: "Laki-laki", dob: "1991-07-05", education: "S1", city: "Jakarta Utara", marga: "Kusuma" },
  { id: "p17", name: "Putri Kusuma", gender: "Perempuan", dob: "1993-09-18", education: "S1", city: "Jakarta Utara", marga: "Kusuma" },
  { id: "p18", name: "Bambang Wijaya", gender: "Laki-laki", dob: "1989-11-20", education: "S2", city: "Tangerang", marga: "Wijaya" },
  { id: "p19", name: "Sari Wijaya", gender: "Perempuan", dob: "1991-12-28", education: "S1", city: "Tangerang", marga: "Wijaya" },
  { id: "p20", name: "Doni Pranoto", gender: "Laki-laki", dob: "1987-05-15", education: "SMA", city: "Bekasi", marga: "Pranoto" },
  { id: "p21", name: "Wati Pranoto", gender: "Perempuan", dob: "1989-08-30", education: "Diploma", city: "Bekasi", marga: "Pranoto" },
  { id: "p22", name: "Erik Santoso", gender: "Laki-laki", dob: "1992-10-12", education: "S1", city: "Depok", marga: "Santoso" },
  { id: "p23", name: "Fitri Santoso", gender: "Perempuan", dob: "1994-02-20", education: "S1", city: "Depok", marga: "Santoso" },
  { id: "p24", name: "Tono Saputra", gender: "Laki-laki", dob: "1990-06-08", education: "Diploma", city: "Bogor", marga: "Saputra" },
];

export const households: Household[] = [
  { id: "h1", title: "Keluarga Wijaya", city: "Jakarta Selatan", address: "Jl. Sudirman No.123", coords: [-6.2088, 106.8456], members: ["p1", "p2", "p3", "p4"] },
  { id: "h2", title: "Keluarga Santoso", city: "Bandung", address: "Jl. Asia Afrika No.45", coords: [-6.9175, 107.6191], members: ["p5", "p6", "p7"] },
  { id: "h3", title: "Keluarga Hermawan", city: "Surabaya", address: "Jl. Tunjungan No.67", coords: [-7.2575, 112.7521], members: ["p8", "p9"] },
  { id: "h4", title: "Keluarga Prasetyo", city: "Yogyakarta", address: "Jl. Malioboro No.88", coords: [-7.7956, 110.3695], members: ["p10", "p11"] },
  { id: "h5", title: "Keluarga Ramadhan", city: "Semarang", address: "Jl. Pemuda No.22", coords: [-6.9667, 110.4167], members: ["p12", "p13"] },
  { id: "h6", title: "Keluarga Setiawan", city: "Malang", address: "Jl. Ijen No.15", coords: [-7.9666, 112.6326], members: ["p14", "p15"] },
];

export const familyTree: TreeNode = {
  id: "root",
  name: "R. Soerjono (1930–2000)",
  personId: "p0",
  children: [
    {
      id: "n1",
      name: "H. Wijaya (1955–)",
      personId: "p1",
      spouse: { personId: "p2" },
      children: [
        { id: "n1-1", name: "Ahmad Wijaya (1985–)", personId: "p3", spouse: { personId: "p4" } },
        { id: "n1-2", name: "Bambang Wijaya (1989–)", personId: "p18", spouse: { personId: "p19" } },
      ]
    },
    {
      id: "n2",
      name: "R. Santoso (1958–)",
      personId: "p5",
      children: [
        { id: "n2-1", name: "Budi Santoso (1990–)", personId: "p6", spouse: { personId: "p7" } },
        { id: "n2-2", name: "Erik Santoso (1992–)", personId: "p22", spouse: { personId: "p23" } },
      ]
    },
  ]
};

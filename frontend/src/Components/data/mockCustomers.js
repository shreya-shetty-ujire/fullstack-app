const customers = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    name: `Customer ${i + 1}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    email: `customer${i + 1}@example.com`,
    age: 22 + (i % 10),
    picture: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i}.jpg`,
}));

export default customers;

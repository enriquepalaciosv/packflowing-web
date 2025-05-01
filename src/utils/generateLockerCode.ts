const generateLockerCode = (name: string, lastName: string) => {
  const initials = `${name[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Número aleatorio de 6 dígitos
  return `${initials}-${randomNumber}`;
};

export default generateLockerCode;

export interface ContactBaseInterface {
  firstname: string
  lastname: string
  email: string
  message: string
}

export interface ContactInterface extends ContactBaseInterface{
  id: number
}

export interface ContactFormInterface extends ContactBaseInterface{
  // rien à ajouter
}

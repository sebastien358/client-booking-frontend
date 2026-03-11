export interface LoginBaseInterface {
  email: string
  password: string
}

export interface LoginInterface extends LoginBaseInterface {
  id: number
}

export interface LoginFormInterface extends LoginBaseInterface {
  // rien à ajouter
}

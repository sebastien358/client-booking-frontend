export interface StaffBaseInterface {
  firstname: string
  lastname: string
  image: File | null
}

export interface StaffInterface extends StaffBaseInterface {
  id: number
}

export interface StaffFormInterface extends StaffBaseInterface {
  // rien à ajouter
}

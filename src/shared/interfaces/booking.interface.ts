export interface BookingBaseInterface {
  firstname: string
  lastname: string
  email: string
  phone: string
  datetime: string
}

export interface BookingInterface extends BookingBaseInterface {
  id: number
}

export interface BookingFormInterface extends BookingBaseInterface {
  // rien à ajouter
}

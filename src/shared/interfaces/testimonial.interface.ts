export interface TestimonialBaseInterface {
  author: string
  job: string
  rating: number
  message: string
}

export interface TestimonialInterface extends TestimonialBaseInterface {
  id: number
}

export interface TestimonialFormInterface extends TestimonialBaseInterface {
  // rien à ajouter
}

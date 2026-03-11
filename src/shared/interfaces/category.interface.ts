export interface CategoryBaseInterface {
  name: string
  slug: string
}

export interface CategoryInterface extends CategoryBaseInterface {
  id: number
}

export interface CategoryFormInterface extends CategoryBaseInterface {
  // rien à ajouter
}

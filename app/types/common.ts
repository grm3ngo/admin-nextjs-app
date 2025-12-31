export interface ApiResponse<T> { // cau truc tra ve api chung
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams { // tham so pagination; so page, item limit , search , sort 
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> { //tham so pagination tra ve; co danh sach, tong so , trang hien tai, gioi han moi trang
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
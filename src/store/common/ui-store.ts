import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoadingState {
  [key: string]: Boolean;
}

interface ErrorState {
  [key: string]: string | null;
}

interface UIState {
  //로딩 및 에러 상태 보관함
  loading: LoadingState;
  errors: ErrorState;

  //로딩관리
  setLoading: (key: string, isLoading: boolean) => void;

  //에러관리
  setError: (key: string, error: string | null) => void;
  clearError: (key: string) => void;

  //헬퍼함수
  isLoading: (key: string) => boolean;
  getError: (key: string) => string | null;
  hasError: (key: string) => boolean;
}

export const useUIStore = create<UIState>()(
  devtools((set, get) => ({
    loading: {},
    errors: {},

    setLoading: (key, isLoading) => {
      set((state) => ({
        loading: { ...state.loading, [key]: isLoading },
      }));
    },
    setError: (key, error) => {
      set((state) => ({
        errors: { ...state.errors, [key]: error },
      }));
    },
    clearError: (key) => {
      set((state) => ({
        errors: { ...state.errors, [key]: null },
      }));
    },

    isLoading: (key) => get().loading[key] || false,
    getError: (key) => get().errors[key] || null,
    hasError: (key) => !!get().errors[key],
  }))
);

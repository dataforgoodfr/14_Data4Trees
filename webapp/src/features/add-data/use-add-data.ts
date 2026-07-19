import { useState } from "react";

import { useApi } from "@shared/hooks/useApi";

import {
  RESOURCE_KINDS,
  RESOURCE_TYPE_BY_KIND,
  type ResourceKind,
} from "./constants";

type AddDataError = "generic" | "missingFile" | "missingForm";

export const useAddData = () => {
  const api = useApi();

  const [form, setForm] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<ResourceKind>(RESOURCE_KINDS.FormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<AddDataError | null>(null);

  const reset = () => {
    setError(null);
    setFile(null);
    setForm("");
    setIsSuccess(false);
    setKind(RESOURCE_KINDS.FormData);
  };

  const submit = async () => {
    setError(null);
    setIsSuccess(false);

    if (!form) {
      setError("missingForm");
      return;
    }
    if (!file) {
      setError("missingFile");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resource_type", RESOURCE_TYPE_BY_KIND[kind]);
    formData.append("package", `catalog/${form}`);
    formData.append("data", file);

    try {
      await api.appendData(formData);
      setFile(null);
      setIsSuccess(true);
    } catch {
      setError("generic");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    file,
    form,
    isLoading,
    isSuccess,
    kind,
    reset,
    setFile,
    setForm,
    setKind,
    submit,
  };
};

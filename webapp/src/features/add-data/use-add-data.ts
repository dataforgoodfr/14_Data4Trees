import { useState } from "react";

import { useApi } from "@shared/hooks/useApi";

import { RESOURCE_KINDS, type ResourceKind } from "./constants";

type AddDataError = "generic" | "missingFile" | "missingForm";

export const useAddData = () => {
  const api = useApi();

  const [form, setForm] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<ResourceKind>(RESOURCE_KINDS.FormData);
  const [resource, setResource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<AddDataError | null>(null);

  const reset = () => {
    setError(null);
    setFile(null);
    setForm("");
    setIsSuccess(false);
    setKind(RESOURCE_KINDS.FormData);
    setResource("");
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

    // Field names are centralized here so they can be aligned with the
    // reworked add-data endpoint in a single place.
    const formData = new FormData();
    formData.append("action", "add");
    formData.append("file", file);
    formData.append("form", form);
    formData.append("kind", kind);
    formData.append("package", `catalog/${form}`);

    // Optional: coordo infers the resource name from the file/sheet names
    // when it is omitted.
    const trimmedResource = resource.trim();
    if (trimmedResource) {
      formData.append("resource", trimmedResource);
    }

    try {
      await api.addData(formData);
      setFile(null);
      setResource("");
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
    resource,
    setFile,
    setForm,
    setKind,
    setResource,
    submit,
  };
};

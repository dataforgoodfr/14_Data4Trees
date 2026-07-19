import { AlertCircle, CheckCircle2, UploadIcon } from "lucide-react";
import type { FC } from "react";

import { useTranslation } from "@i18n";

import { Alert, AlertDescription } from "@ui/alert";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

import {
  ACCEPTED_EXTENSIONS_BY_KIND,
  RESOURCE_KINDS,
  type ResourceKind,
} from "./constants";
import { useAddData } from "./use-add-data";

// The value is the catalog folder name
export type LayerOptions = Array<{ value: string; translation: string }>;

type AddDataDialogProps = {
  layerOptions: LayerOptions;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const AddDataDialog: FC<AddDataDialogProps> = ({
  layerOptions,
  onOpenChange,
  open,
}) => {
  const { t } = useTranslation("common");
  const {
    error,
    form,
    isLoading,
    isSuccess,
    kind,
    reset,
    setFile,
    setForm,
    setKind,
    submit,
  } = useAddData();

  const isFormData = kind === RESOURCE_KINDS.FormData;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
    }
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit();
  };

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={open}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addData.title")}</DialogTitle>
          <DialogDescription>{t("addData.description")}</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-3">
            <Label htmlFor="add-data-form">{t("addData.field.form")}</Label>
            <Select
              onValueChange={(value) => setForm(value)}
              value={form}
            >
              <SelectTrigger id="add-data-form">
                <SelectValue placeholder={t("addData.field.formPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {layerOptions.map(({ value, translation }) => (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {translation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>{t("addData.field.kind")}</Label>
            <RadioGroup
              className="flex gap-6"
              onValueChange={(value) => setKind(value as ResourceKind)}
              value={kind}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="add-data-kind-form"
                  value={RESOURCE_KINDS.FormData}
                />
                <Label
                  className="font-normal"
                  htmlFor="add-data-kind-form"
                >
                  {t("addData.kind.formData")}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="add-data-kind-external"
                  value={RESOURCE_KINDS.ExternalData}
                />
                <Label
                  className="font-normal"
                  htmlFor="add-data-kind-external"
                >
                  {t("addData.kind.externalData")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="add-data-file">{t("addData.field.file")}</Label>
            <Input
              accept={ACCEPTED_EXTENSIONS_BY_KIND[kind]}
              className="hover:cursor-pointer"
              id="add-data-file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
            <p className="text-sm text-muted-foreground">
              {isFormData
                ? t("addData.hint.formData")
                : t("addData.hint.externalData")}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription style={{ "--tw-translate-y": 0 }}>
                {t(`addData.error.${error}`)}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription style={{ "--tw-translate-y": 0 }}>
                {t("addData.success")}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              disabled={isLoading}
              type="submit"
            >
              <UploadIcon />
              {isLoading
                ? t("addData.button.pending")
                : t("addData.button.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

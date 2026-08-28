"use client";

import React from "react";
import { Upload } from "antd";
import type { UploadProps } from "antd";
import { CloudUpload, X } from "lucide-react";
import "../../views/Visa/input.css";

export type UploadFieldProps = {
  id: string;
  name?: string;
  /** Caption above the drop area — "Upload files picture (5:6)" */
  title?: string;
  /** CSS aspect-ratio for the drop area, e.g. `"5 / 6"` */
  aspect?: string;
  /** Max width of the drop area in px — keeps the box centred on wide screens */
  width?: number;
  /** Faded picture shown inside the empty box (the mock-up sample) */
  sample?: string;
  accept?: string;
  /** Rejected above this size, in megabytes */
  maxSizeMb?: number;
  required?: boolean;
  value?: File | null;
  onValueChange?: (file: File | null) => void;
  error?: string;
  className?: string;
};

/** Antd hands `beforeUpload` a `RcFile`; we only ever need the plain `File` */
const isImage = (file: File) => file.type.startsWith("image/");

export const UploadField = ({
  id,
  name,
  title,
  aspect = "5 / 6",
  width = 248,
  sample,
  accept = "image/*,.pdf",
  maxSizeMb = 5,
  required = true,
  value,
  onValueChange,
  error,
  className = "",
}: UploadFieldProps) => {
  const [internal, setInternal] = React.useState<File | null>(null);
  const [localError, setLocalError] = React.useState("");

  const controlled = value !== undefined;
  const file = controlled ? (value ?? null) : internal;

  /** Object URL for the chosen image — revoked whenever the file changes */
  const preview = React.useMemo(
    () => (file && isImage(file) ? URL.createObjectURL(file) : ""),
    [file],
  );

  React.useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const change = (next: File | null) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  /** Returning `false` keeps antd from uploading — the form sends the file */
  const beforeUpload: UploadProps["beforeUpload"] = (raw) => {
    if (raw.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`File must be smaller than ${maxSizeMb} MB`);
      return Upload.LIST_IGNORE;
    }
    setLocalError("");
    change(raw as unknown as File);
    return false;
  };

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalError("");
    change(null);
  };

  const shown = error || localError;

  return (
    <div className={`visa-upload ${className}`} style={{ maxWidth: width }}>
      {title && (
        <p className="visa-upload-title">
          {title}
          {required && <span className="visa-label-required">*</span>}
        </p>
      )}

      <Upload
        accept={accept}
        multiple={false}
        maxCount={1}
        showUploadList={false}
        beforeUpload={beforeUpload}
        className="visa-upload-control"
      >
        {/* antd's own wrapper carries `role="button"` and the keyboard focus */}
        <div
          id={id}
          aria-describedby={shown ? `${id}-error` : undefined}
          className={`visa-upload-box ${shown ? "visa-upload-error" : ""}`}
          style={{
            aspectRatio: aspect,
            // The empty box shows the faded sample; once a picture is picked it
            // shows the picture itself at full opacity
            backgroundImage: preview
              ? `url(${preview})`
              : sample
                ? `url(${sample})`
                : undefined,
          }}
          data-filled={file ? "" : undefined}
        >
          <span className="visa-upload-cta">
            <CloudUpload size={32} strokeWidth={1.75} />
            <span className="visa-upload-cta-text">
              {file ? "Replace" : "Upload"}
            </span>
          </span>

          {file && (
            <button
              type="button"
              onClick={remove}
              aria-label="Remove file"
              className="visa-upload-remove"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </Upload>

      {file && <p className="visa-upload-name">{file.name}</p>}

      {shown && (
        <p id={`${id}-error`} role="alert" className="visa-error-text">
          {shown}
        </p>
      )}

      {/* Keeps the field name in the DOM for native form serialisation */}
      <input type="hidden" name={name ?? id} value={file?.name ?? ""} />
    </div>
  );
};

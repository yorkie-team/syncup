{{/*
Expand the name of the chart.
*/}}
{{- define "syncup.name" -}}
{{- default .Chart.Name .Values.syncup.name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "syncup.fullname" -}}
{{- $name := default .Chart.Name .Values.syncup.name }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "syncup.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "syncup.labels" -}}
helm.sh/chart: {{ include "syncup.chart" . }}
{{ include "syncup.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: {{ include "syncup.name" . }}
app.kubernetes.io/component: server
{{- end }}

{{/*
Selector labels
*/}}
{{- define "syncup.selectorLabels" -}}
app: {{ include "syncup.name" . }}
app.kubernetes.io/name: {{ include "syncup.name" . }}
app.kubernetes.io/instance: {{ include "syncup.name" . }}
{{- end }}

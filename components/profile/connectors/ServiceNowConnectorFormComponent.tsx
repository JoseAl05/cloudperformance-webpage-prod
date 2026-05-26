"use client";

import { useMemo, useState } from "react";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Link2,
  Fingerprint,
  KeyRound,
  Table2,
  Plug,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ApiError,
  createServiceNowConnectorFetcher,
  isServiceNowConnectorConfig,
  SERVICENOW_CONNECTOR_KEY,
} from "@/lib/handleConnectorsCreation";
import { useConnector } from "@/hooks/useConnectors";

type ServiceNowConnectorFormState = {
  instance_url: string;
  client_id: string;
  client_secret: string;
  default_table: string;
};

const INITIAL_STATE: ServiceNowConnectorFormState = {
  instance_url: "",
  client_id: "",
  client_secret: "",
  default_table: "incident",
};

type ServiceNowConnectorFormProps = {
  onCreated?: () => void;
};

export const ServiceNowConnectorFormComponent = ({
  onCreated,
}: ServiceNowConnectorFormProps) => {
  const [formData, setFormData] = useState<ServiceNowConnectorFormState>(INITIAL_STATE);
  const [showSecret, setShowSecret] = useState(false);
  const { connectors, refresh } = useConnector();

  const serviceNowConnector = useMemo(
    () => connectors?.find((connector) => connector.connector_type === "servicenow"),
    [connectors]
  );

  const isConfigured = useMemo(() => {
    if (!serviceNowConnector) return false;
    const { status, config } = serviceNowConnector;
    if (!isServiceNowConnectorConfig(config)) return false;
    return (
      status === "active" &&
      Boolean(config.instance_url) &&
      Boolean(config.client_id) &&
      Boolean(config.default_table)
    );
  }, [serviceNowConnector]);

  const { trigger, isMutating } = useSWRMutation(
    SERVICENOW_CONNECTOR_KEY,
    createServiceNowConnectorFetcher
  );

  const handleChange =
    (field: keyof ServiceNowConnectorFormState) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isMutating) return;

    try {
      await trigger(formData);
      await refresh();
      toast.success("Conector de ServiceNow creado correctamente");
      setFormData(INITIAL_STATE);
      setShowSecret(false);
      onCreated?.();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Ocurrió un error inesperado al crear el conector";
      toast.error(message);
    }
  };

  if (isConfigured && serviceNowConnector && isServiceNowConnectorConfig(serviceNowConnector.config)) {
    const config = serviceNowConnector.config;
    return (
      <Card className="w-full gap-2 border-green-500/40">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" />
              <CardTitle>Conector de ServiceNow</CardTitle>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              {serviceNowConnector.status.toUpperCase()}
            </span>
          </div>
          <CardDescription>
            Revisa la configuración actual del conector de ServiceNow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                URL de la instancia
              </dt>
              <dd
                className="truncate text-sm font-medium"
                title={config.instance_url}
              >
                {config.instance_url}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Fingerprint className="h-3.5 w-3.5" />
                Client ID
              </dt>
              <dd
                className="truncate font-mono text-sm font-medium"
                title={config.client_id}
              >
                {config.client_id}
              </dd>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Table2 className="h-3.5 w-3.5" />
                Tabla por defecto
              </dt>
              <dd
                className="truncate font-mono text-sm font-medium tracking-wide"
                title={config.default_table}
              >
                {config.default_table}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full gap-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          <CardTitle>Conector de ServiceNow</CardTitle>
        </div>
        <CardDescription>
          Configura las credenciales OAuth 2.0 de la aplicación inbound para
          integrar CloudPerformance con tu instancia de ServiceNow. El client
          secret se cifra en el backend antes de ser almacenado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset disabled={isMutating} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="instanceUrl" className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                URL de la instancia
              </Label>
              <Input
                id="instanceUrl"
                type="url"
                placeholder="https://devXXXXXX.service-now.com"
                value={formData.instance_url}
                onChange={handleChange("instance_url")}
                autoComplete="off"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL base de tu instancia de ServiceNow. Se utiliza como punto
                de entrada para el intercambio de tokens y todas las llamadas
                a la API REST.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId" className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                Client ID
              </Label>
              <Input
                id="clientId"
                type="text"
                placeholder="32 caracteres hexadecimales"
                value={formData.client_id}
                onChange={handleChange("client_id")}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Identificador público de la aplicación OAuth Inbound creada en
                el Application Registry de ServiceNow, asociada a una cuenta
                de servicio dedicada.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Client Secret
              </Label>
              <div className="relative">
                <Input
                  id="clientSecret"
                  type={showSecret ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={formData.client_secret}
                  onChange={handleChange("client_secret")}
                  autoComplete="new-password"
                  spellCheck={false}
                  className="pr-10 tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  disabled={isMutating}
                  className={cn(
                    "absolute inset-y-0 right-0 flex items-center px-3",
                    "text-muted-foreground hover:text-foreground transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label={showSecret ? "Ocultar secret" : "Mostrar secret"}
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Secret emparejado con el client ID, generado al crear la
                aplicación OAuth en ServiceNow. Se transmite por TLS y se
                cifra en el backend antes de almacenarse; nunca se persiste
                en texto plano.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="defaultTable"
                className="flex items-center gap-2"
              >
                <Table2 className="h-4 w-4 text-muted-foreground" />
                Tabla por defecto
              </Label>
              <Input
                id="defaultTable"
                type="text"
                placeholder="incident"
                value={formData.default_table}
                onChange={handleChange("default_table")}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Nombre técnico de la tabla en la que CloudPerformance creará
                los tickets (por ejemplo, incident, sc_task, change_request).
                Valor por defecto: incident.
              </p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button type="submit" disabled={isMutating} className='cursor-pointer'>
                {isMutating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isMutating ? "Guardando..." : "Guardar conector"}
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
};
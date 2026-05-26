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
  FolderKanban,
  Plug,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ApiError,
  createJiraConnectorFetcher,
  JIRA_CONNECTOR_KEY,
} from "@/lib/handleConnectorsCreation";
import { useConnector } from "@/hooks/useConnectors";

type JiraConnectorFormState = {
  jira_url: string;
  client_id: string;
  client_secret: string;
  default_project: string;
};

const INITIAL_STATE: JiraConnectorFormState = {
  jira_url: "",
  client_id: "",
  client_secret: "",
  default_project: "",
};

type JiraConnectorFormProps = {
  onCreated?: () => void;
};

export const JiraConnectorFormComponent = ({
  onCreated,
}: JiraConnectorFormProps) => {
  const [formData, setFormData] = useState<JiraConnectorFormState>(INITIAL_STATE);
  const [showSecret, setShowSecret] = useState(false);
  const { connectors, refresh } = useConnector();

  const jiraConnector = useMemo(
    () => connectors?.find((connector) => connector.connector_type === "jira"),
    [connectors]
  );

  const isConfigured = useMemo(() => {
    if (!jiraConnector) return false;
    const { status, config } = jiraConnector;
    return (
      status === "active" &&
      Boolean(config?.jira_url) &&
      Boolean(config?.client_id) &&
      Boolean(config?.default_project)
    );
  }, [jiraConnector]);

  const { trigger, isMutating } = useSWRMutation(
    JIRA_CONNECTOR_KEY,
    createJiraConnectorFetcher
  );

  const handleChange =
    (field: keyof JiraConnectorFormState) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isMutating) return;

    try {
      await trigger(formData);
      await refresh();
      toast.success("Conector de Jira creado correctamente");
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

  if (isConfigured && jiraConnector) {
    return (
      <Card className="w-full gap-2 border-green-500/40">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Plug className="h-5 w-5 text-primary" />
              <CardTitle>Conector de Jira</CardTitle>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              {jiraConnector.status.toUpperCase()}
            </span>
          </div>
          <CardDescription>
            Revisa la configuración actual del conector de Jira.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                URL de Jira
              </dt>
              <dd
                className="truncate text-sm font-medium"
                title={jiraConnector.config.jira_url}
              >
                {jiraConnector.config.jira_url}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Fingerprint className="h-3.5 w-3.5" />
                Client ID
              </dt>
              <dd
                className="truncate font-mono text-sm font-medium"
                title={jiraConnector.config.client_id}
              >
                {jiraConnector.config.client_id}
              </dd>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FolderKanban className="h-3.5 w-3.5" />
                Proyecto por defecto
              </dt>
              <dd
                className="truncate text-sm font-medium uppercase tracking-wide"
                title={jiraConnector.config.default_project}
              >
                {jiraConnector.config.default_project}
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
          <CardTitle>Conector de Jira</CardTitle>
        </div>
        <CardDescription>
          Configura las credenciales OAuth 2.0 de la cuenta de servicio para
          integrar CloudPerformance con tu instancia de Jira. El client secret
          se cifra en el backend antes de ser almacenado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset disabled={isMutating} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="jiraUrl" className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                URL de Jira
              </Label>
              <Input
                id="jiraUrl"
                type="url"
                placeholder="https://tu-empresa.atlassian.net"
                value={formData.jira_url}
                onChange={handleChange("jira_url")}
                autoComplete="off"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL base de tu instancia de Jira Cloud. Se utiliza para
                resolver el cloud ID de la organización y como punto de
                referencia de la integración.
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
                placeholder="00000000-0000-0000-0000-000000000000"
                value={formData.client_id}
                onChange={handleChange("client_id")}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                Identificador público de la credencial OAuth 2.0 generada para
                la cuenta de servicio en admin.atlassian.com (Directory &gt;
                Service accounts &gt; Credentials). Equivale al nombre de
                usuario en el flujo client credentials.
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
                credencial OAuth 2.0 de la cuenta de servicio. Solo se muestra
                una vez en Atlassian. Se transmite por TLS y se cifra en el
                backend antes de almacenarse; nunca se persiste en texto plano.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="defaultProject"
                className="flex items-center gap-2"
              >
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
                Proyecto por defecto
              </Label>
              <Input
                id="defaultProject"
                type="text"
                placeholder="CLOUDPERF"
                value={formData.default_project}
                onChange={handleChange("default_project")}
                autoComplete="off"
                className="uppercase"
                required
              />
              <p className="text-xs text-muted-foreground">
                Clave del proyecto Jira que CloudPerformance utilizará por
                defecto al crear tickets (por ejemplo, hallazgos de
                optimización o alertas de costos).
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
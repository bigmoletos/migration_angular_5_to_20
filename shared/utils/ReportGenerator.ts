/**
 * Générateur de rapports partagé pour toutes les phases de migration
 */

import { ReportFormat, ReportOptions } from '../types';
import { Logger } from './Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ReportGenerator {
  private logger = new Logger('ReportGenerator');

  /**
   * Génère un rapport dans le format spécifié
   */
  async generateReport(data: any, filename: string, options?: ReportOptions): Promise<string> {
    const format = options?.format || ReportFormat.HTML;
    const outputPath = options?.outputPath || './reports';

    // Créer le dossier de sortie s'il n'existe pas
    await this.ensureDirectoryExists(outputPath);

    let content: string;
    let extension: string;

    switch (format) {
      case ReportFormat.HTML:
        content = this.generateHTMLReport(data, options);
        extension = 'html';
        break;
      case ReportFormat.JSON:
        content = this.generateJSONReport(data, options);
        extension = 'json';
        break;
      case ReportFormat.MARKDOWN:
        content = this.generateMarkdownReport(data, options);
        extension = 'md';
        break;
      default:
        throw new Error(`Format de rapport non supporté: ${format}`);
    }

    const filePath = path.join(outputPath, `${filename}.${extension}`);
    await fs.writeFile(filePath, content, 'utf-8');

    this.logger.info(`📄 Rapport généré: ${filePath}`);
    return filePath;
  }

  /**
   * Génère un rapport HTML
   */
  private generateHTMLReport(data: any, options?: ReportOptions): string {
    const includeDetails = options?.includeDetails !== false;
    const includeMetrics = options?.includeMetrics !== false;
    const includeRecommendations = options?.includeRecommendations !== false;

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Migration Angular</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .warning { color: #ffc107; }
        .info { color: #17a2b8; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
        .phase { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .phase.success { border-left: 4px solid #28a745; }
        .phase.error { border-left: 4px solid #dc3545; }
        .recommendations { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .code { background: #f4f4f4; padding: 10px; border-radius: 3px; font-family: monospace; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Rapport de Migration Angular</h1>
        <p><strong>Projet:</strong> ${data.projectPath || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        <p><strong>Statut:</strong> <span class="${data.success ? 'success' : 'error'}">${data.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}</span></p>
    </div>

    ${includeMetrics && data.summary ? `
    <h2>📊 Résumé</h2>
    <div class="metrics">
        <div class="metric-card">
            <h3>Phases Total</h3>
            <p>${data.summary.totalPhases || 0}</p>
        </div>
        <div class="metric-card">
            <h3>Phases Réussies</h3>
            <p class="success">${data.summary.successfulPhases || 0}</p>
        </div>
        <div class="metric-card">
            <h3>Phases Échouées</h3>
            <p class="error">${data.summary.failedPhases || 0}</p>
        </div>
        <div class="metric-card">
            <h3>Durée Totale</h3>
            <p>${this.formatDuration(data.totalDuration || 0)}</p>
        </div>
    </div>
    ` : ''}

    ${includeDetails && data.phases ? `
    <h2>📋 Détail des Phases</h2>
    ${data.phases.map((phase: any) => `
        <div class="phase ${phase.success ? 'success' : 'error'}">
            <h3>${phase.phase || phase.name || 'Phase inconnue'}</h3>
            <p><strong>Statut:</strong> <span class="${phase.success ? 'success' : 'error'}">${phase.success ? '✅ Réussie' : '❌ Échouée'}</span></p>
            <p><strong>Durée:</strong> ${this.formatDuration(phase.duration || 0)}</p>
            ${phase.errors && phase.errors.length > 0 ? `
                <p><strong>Erreurs:</strong></p>
                <ul>
                    ${phase.errors.map((error: string) => `<li class="error">${error}</li>`).join('')}
                </ul>
            ` : ''}
            ${phase.warnings && phase.warnings.length > 0 ? `
                <p><strong>Avertissements:</strong></p>
                <ul>
                    ${phase.warnings.map((warning: string) => `<li class="warning">${warning}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('')}
    ` : ''}

    ${includeRecommendations && data.recommendations ? `
    <h2>💡 Recommandations</h2>
    <div class="recommendations">
        <ul>
            ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
        <p>Rapport généré par l'outil de migration Angular 5 → 20</p>
    </footer>
</body>
</html>`;
  }

  /**
   * Génère un rapport JSON
   */
  private generateJSONReport(data: any, options?: ReportOptions): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Génère un rapport Markdown
   */
  private generateMarkdownReport(data: any, options?: ReportOptions): string {
    const includeDetails = options?.includeDetails !== false;
    const includeMetrics = options?.includeMetrics !== false;
    const includeRecommendations = options?.includeRecommendations !== false;

    let markdown = `# 🚀 Rapport de Migration Angular\n\n`;

    markdown += `**Projet:** ${data.projectPath || 'N/A'}\n`;
    markdown += `**Date:** ${new Date().toLocaleString('fr-FR')}\n`;
    markdown += `**Statut:** ${data.success ? '✅ SUCCÈS' : '❌ ÉCHEC'}\n\n`;

    if (includeMetrics && data.summary) {
      markdown += `## 📊 Résumé\n\n`;
      markdown += `| Métrique | Valeur |\n`;
      markdown += `|----------|--------|\n`;
      markdown += `| Phases Total | ${data.summary.totalPhases || 0} |\n`;
      markdown += `| Phases Réussies | ${data.summary.successfulPhases || 0} |\n`;
      markdown += `| Phases Échouées | ${data.summary.failedPhases || 0} |\n`;
      markdown += `| Durée Totale | ${this.formatDuration(data.totalDuration || 0)} |\n\n`;
    }

    if (includeDetails && data.phases) {
      markdown += `## 📋 Détail des Phases\n\n`;
      data.phases.forEach((phase: any) => {
        markdown += `### ${phase.phase || phase.name || 'Phase inconnue'}\n\n`;
        markdown += `- **Statut:** ${phase.success ? '✅ Réussie' : '❌ Échouée'}\n`;
        markdown += `- **Durée:** ${this.formatDuration(phase.duration || 0)}\n`;

        if (phase.errors && phase.errors.length > 0) {
          markdown += `- **Erreurs:**\n`;
          phase.errors.forEach((error: string) => {
            markdown += `  - ❌ ${error}\n`;
          });
        }

        if (phase.warnings && phase.warnings.length > 0) {
          markdown += `- **Avertissements:**\n`;
          phase.warnings.forEach((warning: string) => {
            markdown += `  - ⚠️ ${warning}\n`;
          });
        }

        markdown += `\n`;
      });
    }

    if (includeRecommendations && data.recommendations) {
      markdown += `## 💡 Recommandations\n\n`;
      data.recommendations.forEach((rec: string) => {
        markdown += `- ${rec}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `*Rapport généré par l'outil de migration Angular 5 → 20*\n`;

    return markdown;
  }

  /**
   * Formate la durée en millisecondes
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * S'assure que le dossier existe
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}

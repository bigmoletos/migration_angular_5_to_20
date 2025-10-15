import * as fs from 'fs-extra';
import * as path from 'path';
import { MigrationReport, MigrationSummary, FileMigrationDetails } from '../types';
import { Logger } from './Logger';

/**
 * Générateur de rapports de migration
 */
export class ReportGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Génère un rapport complet de migration
   */
  async generateReport(report: MigrationReport): Promise<void> {
    try {
      const reportDir = path.join(report.project.path, 'migration-reports');
      await fs.ensureDir(reportDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFileName = `migration-report-${timestamp}.html`;
      const reportPath = path.join(reportDir, reportFileName);

      // Générer le rapport HTML
      const htmlContent = this.generateHtmlReport(report);
      await fs.writeFile(reportPath, htmlContent, 'utf-8');

      // Générer le rapport JSON
      const jsonFileName = `migration-report-${timestamp}.json`;
      const jsonPath = path.join(reportDir, jsonFileName);
      await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf-8');

      // Générer le rapport Markdown
      const mdFileName = `migration-report-${timestamp}.md`;
      const mdPath = path.join(reportDir, mdFileName);
      const mdContent = this.generateMarkdownReport(report);
      await fs.writeFile(mdPath, mdContent, 'utf-8');

      this.logger.success(`📊 Rapport généré: ${reportPath}`);
      this.logger.info(`📄 Rapport JSON: ${jsonPath}`);
      this.logger.info(`📝 Rapport Markdown: ${mdPath}`);

    } catch (error) {
      this.logger.error(`Erreur lors de la génération du rapport: ${error.message}`);
      throw error;
    }
  }

  /**
   * Génère un rapport HTML
   */
  private generateHtmlReport(report: MigrationReport): string {
    const summary = report.summary;
    const project = report.project;

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Migration Angular - ${project.path}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header .subtitle { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .value { font-size: 2em; font-weight: bold; color: #667eea; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .file-list { background: #f8f9fa; border-radius: 8px; padding: 20px; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
        .file-item:last-child { border-bottom: none; }
        .file-path { font-family: monospace; color: #495057; }
        .file-stats { display: flex; gap: 15px; }
        .stat { background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 0.9em; }
        .stat.issues { background: #fff3cd; color: #856404; }
        .stat.transformations { background: #d1ecf1; color: #0c5460; }
        .recommendations { background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; }
        .recommendations h3 { color: #155724; margin-top: 0; }
        .recommendations ul { margin: 0; }
        .recommendations li { margin-bottom: 8px; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .error h3 { color: #721c24; margin-top: 0; }
        .timestamp { text-align: center; color: #6c757d; font-size: 0.9em; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Rapport de Migration Angular</h1>
            <p class="subtitle">Migration de ${project.currentVersion} vers ${project.targetVersion}</p>
            <p class="subtitle">Projet: ${project.path}</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="summary-card">
                    <h3>Fichiers Analysés</h3>
                    <div class="value">${summary.totalFiles}</div>
                </div>
                <div class="summary-card">
                    <h3>Fichiers Modifiés</h3>
                    <div class="value">${summary.modifiedFiles}</div>
                </div>
                <div class="summary-card">
                    <h3>Issues Détectées</h3>
                    <div class="value">${summary.totalIssues}</div>
                </div>
                <div class="summary-card">
                    <h3>Transformations Appliquées</h3>
                    <div class="value">${summary.appliedTransformations}</div>
                </div>
            </div>

            ${report.errors.length > 0 ? `
            <div class="error">
                <h3>❌ Erreurs Rencontrées</h3>
                <ul>
                    ${report.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="section">
                <h2>📁 Détails par Fichier</h2>
                <div class="file-list">
                    ${report.fileDetails.map(fileDetail => `
                        <div class="file-item">
                            <div class="file-path">${fileDetail.file.path}</div>
                            <div class="file-stats">
                                <span class="stat issues">${fileDetail.issues.length} issues</span>
                                <span class="stat transformations">${fileDetail.transformations.length} transformations</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${report.recommendations.length > 0 ? `
            <div class="section">
                <h2>💡 Recommandations</h2>
                <div class="recommendations">
                    <h3>Améliorations Suggérées</h3>
                    <ul>
                        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            ` : ''}

            <div class="timestamp">
                Rapport généré le ${new Date().toLocaleString('fr-FR')} - 
                Temps d'exécution: ${report.executionTime}ms
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Génère un rapport Markdown
   */
  private generateMarkdownReport(report: MigrationReport): string {
    const summary = report.summary;
    const project = report.project;

    return `# 🚀 Rapport de Migration Angular

## 📋 Résumé

- **Projet**: ${project.path}
- **Version source**: ${project.currentVersion}
- **Version cible**: ${project.targetVersion}
- **Date**: ${new Date().toLocaleString('fr-FR')}
- **Temps d'exécution**: ${report.executionTime}ms

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Fichiers analysés | ${summary.totalFiles} |
| Fichiers modifiés | ${summary.modifiedFiles} |
| Issues détectées | ${summary.totalIssues} |
| Transformations appliquées | ${summary.appliedTransformations} |
| Transformations échouées | ${summary.failedTransformations} |

## 📁 Détails par Fichier

${report.fileDetails.map(fileDetail => `
### ${fileDetail.file.path}

- **Type**: ${fileDetail.file.type}
- **Issues**: ${fileDetail.issues.length}
- **Transformations**: ${fileDetail.transformations.length}

${fileDetail.issues.length > 0 ? `
#### Issues Détectées
${fileDetail.issues.map(issue => `- **${issue.type}**: ${issue.message}`).join('\n')}
` : ''}

${fileDetail.transformations.length > 0 ? `
#### Transformations Appliquées
${fileDetail.transformations.map(transformation => `- **${transformation.type}**: ${transformation.description}`).join('\n')}
` : ''}
`).join('\n')}

${report.errors.length > 0 ? `
## ❌ Erreurs

${report.errors.map(error => `- ${error}`).join('\n')}
` : ''}

${report.recommendations.length > 0 ? `
## 💡 Recommandations

${report.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}

---
*Rapport généré automatiquement par l'outil de migration Angular*
`;
  }

  /**
   * Génère un résumé console
   */
  generateConsoleSummary(report: MigrationReport): void {
    const summary = report.summary;
    
    this.logger.section('📊 Résumé de la Migration');
    
    this.logger.table([
      { Métrique: 'Fichiers analysés', Valeur: summary.totalFiles },
      { Métrique: 'Fichiers modifiés', Valeur: summary.modifiedFiles },
      { Métrique: 'Issues détectées', Valeur: summary.totalIssues },
      { Métrique: 'Transformations appliquées', Valeur: summary.appliedTransformations },
      { Métrique: 'Transformations échouées', Valeur: summary.failedTransformations },
      { Métrique: 'Temps d\'exécution', Valeur: `${report.executionTime}ms` }
    ], ['Métrique', 'Valeur']);

    if (report.recommendations.length > 0) {
      this.logger.section('💡 Recommandations');
      report.recommendations.forEach(rec => this.logger.info(`• ${rec}`));
    }

    if (report.errors.length > 0) {
      this.logger.section('❌ Erreurs');
      report.errors.forEach(error => this.logger.error(error));
    }
  }
}

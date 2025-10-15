import * as chalk from 'chalk';

/**
 * Utilitaire de logging avec couleurs et niveaux
 */
export class Logger {
  private verbose: boolean = false;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  /**
   * Active le mode verbeux
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Log d'information
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log de succès
   */
  success(message: string): void {
    console.log(chalk.green('✅'), message);
  }

  /**
   * Log d'avertissement
   */
  warn(message: string): void {
    console.log(chalk.yellow('⚠️'), message);
  }

  /**
   * Log d'erreur
   */
  error(message: string): void {
    console.log(chalk.red('❌'), message);
  }

  /**
   * Log de débogage (seulement en mode verbeux)
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(chalk.gray('🐛'), message);
    }
  }

  /**
   * Log de progression
   */
  progress(current: number, total: number, message: string): void {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    console.log(`\r${progressBar} ${percentage}% - ${message}`);
  }

  /**
   * Crée une barre de progression
   */
  private createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  }

  /**
   * Log d'une section
   */
  section(title: string): void {
    console.log('\n' + chalk.cyan('═'.repeat(50)));
    console.log(chalk.cyan.bold(`  ${title}`));
    console.log(chalk.cyan('═'.repeat(50)) + '\n');
  }

  /**
   * Log d'un tableau
   */
  table(data: Array<Record<string, any>>, columns: string[]): void {
    if (data.length === 0) {
      this.info('Aucune donnée à afficher');
      return;
    }

    // Calculer les largeurs des colonnes
    const widths = columns.map(col => {
      const headerWidth = col.length;
      const dataWidth = Math.max(...data.map(row => String(row[col] || '').length));
      return Math.max(headerWidth, dataWidth);
    });

    // Afficher l'en-tête
    const header = columns.map((col, i) => col.padEnd(widths[i])).join(' | ');
    console.log(chalk.bold(header));
    console.log(chalk.gray('-'.repeat(header.length)));

    // Afficher les données
    data.forEach(row => {
      const rowData = columns.map((col, i) => String(row[col] || '').padEnd(widths[i])).join(' | ');
      console.log(rowData);
    });
  }

  /**
   * Log d'un objet JSON formaté
   */
  json(obj: any, title?: string): void {
    if (title) {
      this.info(title);
    }
    console.log(JSON.stringify(obj, null, 2));
  }

  /**
   * Efface la ligne actuelle
   */
  clearLine(): void {
    process.stdout.write('\r\x1b[K');
  }

  /**
   * Log avec timestamp
   */
  timestamped(level: 'info' | 'success' | 'warn' | 'error' | 'debug', message: string): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;
    
    switch (level) {
      case 'info':
        this.info(formattedMessage);
        break;
      case 'success':
        this.success(formattedMessage);
        break;
      case 'warn':
        this.warn(formattedMessage);
        break;
      case 'error':
        this.error(formattedMessage);
        break;
      case 'debug':
        this.debug(formattedMessage);
        break;
    }
  }
}

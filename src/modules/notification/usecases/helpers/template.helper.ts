export class TemplateHelper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static makeDecorator(text: string) {
    // TODO: implement logic extract decorators from the template
    const decorators: PrismaJson.NotificationDecoratorType[] = [];

    return decorators;
  }

  static getRawText(text: string) {
    return text.replace(/<\/?d.*?>/g, '');
  }
}

package lzr.multipleStatus;

public class Test {

    public static void main(String[] args) {
        Circle circle=new Circle();
        Triangle triangle=new Triangle();
        Line line=new Line();
        doSomething(circle);
        doSomething(triangle);
        doSomething(line);
    }

    private static void doSomething(Shape shape){
        shape.draw();
        shape.erase();
    }
}

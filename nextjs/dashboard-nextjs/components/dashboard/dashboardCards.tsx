import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import SkeletonCard from './SkeletonCard';

type CardsListProps = {
  cards: DashBoardCard[];
};

type DashBoardCard = {
  title: string;
  subtitle?: string;
  body: string;
};

export default function DashboardCards({ cards }: CardsListProps) {
  return (
    <>
      {cards.map((card) => {
        return (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card?.title}</CardTitle>
              <CardDescription>{card?.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{card?.body}</p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
